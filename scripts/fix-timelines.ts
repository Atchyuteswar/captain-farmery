import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const flow = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"];

async function main() {
  const orders = await prisma.order.findMany({
    include: { timeline: true }
  });

  let updatedCount = 0;

  for (const order of orders) {
    if (order.timeline.length < 2) continue;

    // Sort timeline by flow index
    const sortedTimeline = [...order.timeline].sort((a, b) => {
      const indexA = flow.indexOf(a.status);
      const indexB = flow.indexOf(b.status);
      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
    
    // Base date (earliest date from the timeline)
    const baseDate = new Date(Math.min(...order.timeline.map(t => t.createdAt.getTime())));

    for (let i = 0; i < sortedTimeline.length; i++) {
      const entry = sortedTimeline[i];
      // Offset each subsequent event by 1 second to guarantee strict ordering
      const newDate = new Date(baseDate.getTime() + (i * 1000));
      
      await prisma.orderTimeline.update({
        where: { id: entry.id },
        data: { createdAt: newDate }
      });
      updatedCount++;
    }
  }

  console.log(`Updated ${updatedCount} timeline events to perfectly match the chronological sequence.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
