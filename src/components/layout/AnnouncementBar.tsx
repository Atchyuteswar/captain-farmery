export default function AnnouncementBar() {
  return (
    <div className="w-full bg-primary text-primary-foreground py-2 text-xs md:text-sm font-medium overflow-hidden whitespace-nowrap">
      <div className="animate-in fade-in slide-in-from-top-2 duration-500">
        <div className="flex gap-16 md:gap-32 w-max animate-marquee">
          <span>🌾 100% Raw Forest Honey Available Now!</span>
          <span>🚚 Free shipping on orders above ₹999</span>
          <span>✨ New Arrivals: Stone-ground Spices</span>
          <span>🌾 100% Raw Forest Honey Available Now!</span>
          <span>🚚 Free shipping on orders above ₹999</span>
          <span>✨ New Arrivals: Stone-ground Spices</span>
        </div>
      </div>
    </div>
  )
}
