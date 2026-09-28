import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminEmail = 'admin@captainfarmery.com'
  
  let admin = await prisma.user.findUnique({
    where: { email: adminEmail }
  })

  if (!admin) {
    console.log('Admin user not found. Creating one...')
    const passwordHash = await bcrypt.hash('admin123', 10)
    admin = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: adminEmail,
        passwordHash,
        role: 'ADMIN',
      }
    })
    console.log('Created admin user: admin@captainfarmery.com / admin123')
  } else {
    console.log('Admin user exists: ' + admin.email)
    if (admin.role !== 'ADMIN') {
      console.log('User is not an admin, upgrading role to ADMIN...')
      await prisma.user.update({
        where: { id: admin.id },
        data: { role: 'ADMIN' }
      })
      console.log('Role upgraded successfully.')
    }
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
