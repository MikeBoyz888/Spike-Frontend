import Image from 'next/image';
import Link from 'next/link';
import WishlistButton from '@/components/WishlistButton';
import CouponBanner from '@/components/CouponBanner';
import BrandShowcase from '@/components/BrandShowcase';
import HomeContact from '@/components/HomeContact';

async function getAllProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
}

export default async function HomePage() {
  const productData = await getAllProducts();
  const productsList = productData?.data || [];
  const safeProductsList = Array.isArray(productsList) ? productsList : [];

  return (
    <div className="font-sans">
      {/* hero banner */}
      <section className="relative w-full h-[80vh] flex items-center justify-center">
        <Image
          src="https://res.cloudinary.com/dtjlyyvjv/image/upload/v1780505820/HeroBanner_q3pxf0.jpg"
          alt="HeroBanner"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-foreground/10 flex flex-col justify-center px-6 md:px-16 lg:px-24">
          <div className="w-full md:w-2/3 flex flex-col items-start text-left">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter mb-8 text-[#171412] drop-shadow-md leading-[0.9]">
              <span className="text-primary">
                SPIKE GARMENT
              </span> <br />
              SWAG IS A <br /> {/*br để xuống dòng */}
              LIFESTYLE
            </h1>
            <Link href="/shop" className="px-10 py-4 bg-primary text-white uppercase tracking-widest text-xs font-bold rounded-button hover:bg-primary/90 transition-all shadow-xl hover:shadow-primary/50">
              DISCOVER NOW
            </Link>
          </div>
        </div>
      </section>

      <CouponBanner />

      {/* new arrivals */}
      <section className="py-24 px-6 md:px-12 max-w-screen-2xl mx-auto text-foreground">

        <div className="flex justify-between items-end mb-12 border-b border-foreground/10 pb-4">
          <h2 className="text-2xl font-black uppercase">
            Latest Arrivals
          </h2>
          <Link href="/shop" className="text-xm uppercase font-bold hover:text-primary transition-colors">
            View All
          </Link>
        </div>
        {safeProductsList.length === 0 ? (
          <div className="text-center py-20 text-foreground/40 uppercase tracking-widest text-sm font-bold">
            <p>NO PRODUCTS AVAILABLE</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16">

            {safeProductsList.slice(0, 8).map((product) => (
              <Link href={`/product/${product.slug}`} key={product._id} className="group block">
                <div className="relative aspect-square bg-white overflow-hidden mb-5 flex items-center justify-center">

                  <WishlistButton
                    productId={product._id}
                    className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md text-foreground hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                  />

                  {/* ảnh 1 preview */}
                  <Image
                    src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder.jpg'}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={`object-contain object-center transition-all duration-500 ease-in-out p-4 ${product.images && product.images.length > 1
                      ? 'group-hover:opacity-0'
                      : 'group-hover:scale-105'
                      }`}
                  />
                  {/*ảnh 2 mặc định ẩn, chỉ hiện khi hover*/}
                  {product.images && product.images.length > 1 && (
                    <Image
                      src={product.images[1]}
                      alt={`${product.name} - View 2`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover object-center opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 ease-in-out absolute top-0 left-0"
                    />
                  )}
                  {/* button xem chi tiết */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <span className="bg-background text-foreground px-6 py-2 text-[10px] font-bold uppercase tracking-widest rounded-button shadow-lg whitespace-nowrap">
                      View Details
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-center text-center uppercase">
                  <h3 className="text-xs font-bold tracking-widest mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm font-medium">
                    {product.basePrice?.toLocaleString('vi-VN')} VNĐ
                  </p>
                </div>
              </Link>
            ))}

          </div>
        )}
      </section>

      <BrandShowcase />
      <HomeContact />

      <section className="py-24 bg-foreground text-background text-center px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-6 text-primary">
            SPIKE GARMENT
          </h2>
          <p className="text-sm font-medium leading-relaxed tracking-wide opacity-80">
            A dynamic fashion complex and the ultimate creative playground for brands to express their unique individuality. More than just a retail destination, we are a thriving cultural hub where diverse styles, visionary designers, and authentic self-expression converge.
          </p>
        </div>
      </section>
    </div>
  );
}