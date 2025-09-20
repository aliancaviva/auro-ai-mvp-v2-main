import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import gif1 from "@/assets/gif1.gif";
import gif2 from "@/assets/gif2.gif";
import gif3 from "@/assets/gif3.gif";
import gif4 from "@/assets/gif4.gif";
import gif5 from "@/assets/gif5.gif";

const gifs = [
  { id: 1, src: gif1, alt: "Processo de instalação passo 1" },
  { id: 2, src: gif2, alt: "Processo de instalação passo 2" },
  { id: 3, src: gif3, alt: "Processo de instalação passo 3" },
  { id: 4, src: gif4, alt: "Processo de instalação passo 4" },
  { id: 5, src: gif5, alt: "Processo de instalação passo 5" },
];

export function GifCarousel() {
  return (
    <div className="relative w-full max-w-none px-0">
      <Carousel
        opts={{
          align: "start",
          loop: true,
          skipSnaps: false,
          dragFree: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-0">
          {gifs.map((gif, index) => (
            <CarouselItem
              key={gif.id}
              className="pl-0 basis-full"
            >
              <div className="relative group">
                <div className="relative overflow-hidden">
                  <img
                    src={gif.src}
                    alt={gif.alt}
                    className="w-full h-[32rem] md:h-[40rem] lg:h-[42rem] object-contain bg-transparent"
                    loading="lazy"
                  />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Custom navigation buttons */}
        <CarouselPrevious className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background border-border/50 hover:border-border shadow-lg backdrop-blur-sm">
          <ChevronLeft className="h-4 w-4" />
        </CarouselPrevious>
        
        <CarouselNext className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background border-border/50 hover:border-border shadow-lg backdrop-blur-sm">
          <ChevronRight className="h-4 w-4" />
        </CarouselNext>
      </Carousel>
    </div>
  );
}