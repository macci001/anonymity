"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import Autoplay from 'embla-carousel-autoplay';

import messages from "@/messages.json";
import { Button } from "@/components/ui/button";
import { ArrowUpNarrowWide, Handshake, HeartIcon, LogIn, Scale, Shapes, ShieldCheck, UserCheck } from "lucide-react";
import Link from "next/link";

export default function Home() {
  var foo = "Bob \
is \
cool.";
  return (
    <main className="flex flex-col items-center w-full p-4">
      <div className="flex flex-col items-center max-w-4xl justify-center text-center">
        <div className="my-4 flex flex-col items-center">
          <img src="./logo.png" className="w-20 h-20 my-2"></img>
          <div className="text-4xl md:text-6xl my-2 font-medium flex">Explore the power of the secret feedback</div>
        </div>
        <div className="my-4">
          <div className="my-2 text-sm">Send anonymous feedback to your friend, colleague, favourite youtuber...</div>
          <Button className="my-2">
            <Link href={"/sign-up"} className="flex items-center">
            Join the Tribe for free <LogIn className="ml-2 w-4 h-4"/> 
            </Link>
          </Button>
        </div>
        <div className="my-4">
          <div className="my-2 flex flex-col gap-y-4 items-center">
            <div className="flex">
              <img src="./icon1.jpeg" className="w-10 h-10 bg-red-200 rounded-full border border-2 border-foreground">
              </img>
              <img src="./icon2.jpeg" className="w-10 h-10 -ml-4 bg-red-200 rounded-full border border-2 border-foreground">
              </img>
              <img src="./icon3.jpeg" className="w-10 h-10 -ml-4 bg-red-200 rounded-full border border-2 border-foreground">
              </img>
              <img src="./icon4.jpeg" className="w-10 h-10 -ml-4 bg-red-200 rounded-full border border-2 border-foreground">
              </img>
              <img src="./icon5.jpeg" className="w-10 h-10 -ml-4 bg-red-200 rounded-full border border-2 border-foreground">
              </img>
            </div>
            <div className="text-muted-foreground ">
              More than <span className="text-foreground">1000</span> users trust secret message!
            </div>
          </div>
        </div>
      </div>
      <Carousel 
        className="w-[80vw] sm:max-w-[450px] md:max-w-xl my-4"
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
      <div className="my-4 flex flex-col items-center w-full gap-y-4 hidden sm:flex">
        <div className="text-lg">Why SecretFeedback?</div>
        <div className="text-sm text-muted-foreground">
          The reason why the feedback should be secret.
        </div>
        <div className="grid grid-cols-6 justify-between w-[80vw] gap-4">
          <div className="col-span-6 sm:col-span-3 md:col-span-2 border border-1 border-foreground/20 rounded-md w-full p-4 shadow-sm shadow-foreground/10">
            <div className="text-md my-2 flex items-center">
              <Handshake className="h-4 w-4 mr-2" />
              Encourages Honesty
            </div>
            <div className="text-sm text-muted-foreground">People are likely to provide more genuine and honest feedback when their identity remains secret.</div>
          </div>
          <div className="col-span-6 sm:col-span-3 md:col-span-2 border border-1 border-foreground/20 rounded-md w-full p-4 shadow-sm shadow-foreground/10">
            <div className="text-md my-2 flex items-center">
              <Scale className="h-4 w-4 mr-2"/>
              Prevents Bias
            </div>
            <div className="text-sm text-muted-foreground">Secret feedback ensures that personal biases and preferences don't influence the feedback provided.</div>
          </div>
          <div className="col-span-6 sm:col-span-3 md:col-span-2 border border-1 border-foreground/20 rounded-md w-full p-4 shadow-sm shadow-foreground/10">
            <div className="text-md my-2 flex items-center">
              <ShieldCheck className="h-4 w-4 mr-2"/>
              Reduces Fear
            </div>
            <div className="text-sm text-muted-foreground">Secret feedback eliminates the fear of retribution, encouraging people to speak up without worry.</div>
          </div>
          <div className="col-span-6 sm:col-span-3 md:col-span-2 border border-1 border-foreground/20 rounded-md w-full p-4 shadow-sm shadow-foreground/10">
            <div className="text-md my-2 flex items-center">
              <UserCheck className="h-4 w-4 mr-2"/>
              Promotes Openness
            </div>
            <div className="text-sm text-muted-foreground">Secrecy allows individuals to share their thoughts and feelings freely without fear of judgment.</div>
          </div>
          <div className="col-span-6 sm:col-span-3 md:col-span-2 border border-1 border-foreground/20 rounded-md w-full p-4 shadow-sm shadow-foreground/10">
            <div className="text-md my-2 flex items-center">
              <Shapes className="h-4 w-4 mr-2"/>
              Fosters Diversity
            </div>
            <div className="text-sm text-muted-foreground">Secret feedback encourages the inclusion of diverse opinions from a wide audience.</div>
          </div>
          <div className="col-span-6 sm:col-span-3 md:col-span-2 border border-1 border-foreground/20 rounded-md w-full p-4 shadow-sm shadow-foreground/10">
            <div className="text-md my-2 flex items-center">
              <ArrowUpNarrowWide className="h-4 w-4 mr-2"/>
              Increases Participation
            </div>
            <div className="text-sm text-muted-foreground">More people are likely to contribute feedback when they know their identity will remain secret.</div>
          </div>
        </div>
      </div>

      <div className="mt-8 w-full flex justify-start text-xs items-center text-muted-foreground/80">
          <div className="flex items-center">made with <HeartIcon className="w-3 h-3 mx-1"/> by </div>
          <Link href={"https://www.maharshialpesh.com"} className="ml-1">maharshialpesh</Link>
      </div>
    </main>
  );
}
