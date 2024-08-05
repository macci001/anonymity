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
  return (
    <main className="flex flex-col items-center w-full p-8">
      <div className="text-4xl font-bold p-2">Anonymity</div>
      <div className="text-2xl p-2 text-muted-foreground">Explore the power of the anonymous feedback</div>
      <Carousel 
        className="w-[50vw] mt-20"
        plugins={[Autoplay({ delay: 2000 })]}
      >
        <CarouselContent>
          {messages.map((message, index) => (
            <CarouselItem key={index}>
              <div>
                <Card className="p-4">
                  <CardTitle className="font-normal text-lg flex items-center justify-center">{message.title}</CardTitle>
                  <CardContent className="flex items-center justify-center p-6">
                    <span className="text-4xl font-semibold">{message.content}</span>
                  </CardContent>
                  <CardFooter className="pl-0 pt-4 text-muted-foreground flex justify-end">
                    {message.received}
                  </CardFooter>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
      </Carousel>
    </main>
  );
}
