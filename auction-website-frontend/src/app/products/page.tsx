"use client"
import Image from "next/image";
import imagePlaceHolder from '../images.png';
import { useState } from "react";

function cn(...clasess: string[]){
  return clasess.filter(Boolean).join(' ');
}
export default function Home() {
  return (
    <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        <ItemCard/>
        <ItemCard/>

        <ItemCard/>

        <ItemCard/>
        <ItemCard/>

      </div>
    </div>
  );
}


function ItemCard(){
  const [isLoading, setLoading] = useState(true);
  return(
    <a href="#" className="group">
      <div className="aspect-w-1 aspect-h-1 bg-red-200 w-full rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
        <Image
          alt=""
          src={imagePlaceHolder}
          width={500}
          height={500}          
          objectFit="cover"
          className={cn(
            'group-hover:opacity-75 duration-700 ease-in-out',
            isLoading
            ? 'greyscale blur-2xl scale-110'
            : 'greyscale-0 blue-0 scale 100'
          )}
          onLoadingComplete={()=> setLoading(false)}
        />
      </div>
      <h3 className="mt-4 text-sm text-gray-700">Test 1</h3>
      <p className="mt-1 text-lg font-medium text-gray-900">Test 2</p>
    </a>
  )
}
