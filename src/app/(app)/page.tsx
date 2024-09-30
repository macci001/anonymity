"use client"

import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from 'embla-carousel-autoplay';

import messages from "@/messages.json";

export default function Home() {
  var foo = "Bob \
is \
cool.";
  return (
    <main className="flex flex-col items-center w-full p-8">
      <div className="flex flex-col items-center">
        <div className="text-3xl font-semibold">SecretFeedback</div>
        <div className="text-sm py-2 text-muted-foreground">Explore the power of the secret feedback</div>

      </div>
      <Carousel 
        className="w-[80vw] sm:max-w-[450px] md:max-w-xl"
        plugins={[Autoplay({ delay: 2000 })]}
      >
        <CarouselContent>
          {messages.map((message, index) => (
            <CarouselItem key={index}>
              <div>
                <Card className="p-4 w-full h-full relative">
                <CardContent>
                  <span className="text-neutral font-medium break-words">
                    {message.content}
                  </span>
                </CardContent>
                <CardFooter className="text-xs absolute bottom-0 right-0 text-muted-foreground">
                  {message.received}
                </CardFooter>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </main>
  );
}
