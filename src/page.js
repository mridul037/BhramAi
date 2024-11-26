"use client";

import LinkedinIcon from "./components/icons/github-icon";
import XIcon from "./components/icons/x-icon";

import Spinner from "./components/spinner";
import { Button } from "./components/ui/button";


import { Switch } from "./components/ui/switch";
import { Textarea } from "./components/ui/textarea";
import imagePlaceholder from "./public/image-placeholder.png";
import { useQuery,useMutation } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";

import { useEffect, useState } from "react";
import bhlogo from "./fonts/bhramlogo.png";
import  CallF  from './api/index';

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [iterativeMode, setIterativeMode] = useState(false);
  const [isLoading,setIsLoading]=useState(false);
  const [userAPIKey, setUserAPIKey] = useState("");
  const debouncedPrompt = useDebounce(prompt, 500);
  const [image,setImage]=useState()
  const [generations, setGenerations] = useState([]);
  let [activeIndex, setActiveIndex] = useState();

//   const {  mutate, isLoading, isError, error } = useMutation({
//     mutationFn: async () => {
//       // Trigger CallF with the necessary parameters
//       const res = await CallF({ prompt, userAPIKey, iterativeMode });
//       return res; // Return the result of the API call (e.g., image data)
//     },
//     onError: (err) => {
//       console.error("Error during image generation:", err);
//     },
//     onSuccess: (data) => {
//       console.log("Image generated successfully", data);
//     },
//   });

  let isDebouncing = prompt !== debouncedPrompt;
  
  useEffect(() => {
    // if (image && !generations.map((g) => g.image).includes(image)) {
    //   setGenerations((images) => [...images, { prompt, image }]);
    //   setActiveIndex(generations.length);

    // }
   
    const generateImage = async () => {
        setIsLoading(true);  
     // Set loading state to true while generating image
        
    try {
        // Call the CallF function with debounced prompt, user API key, and iterative mode
        const response = await CallF({ prompt: debouncedPrompt, userAPIKey, iterativeMode });
        console.log("Generated Image Response:", response);  // Log the response for debugging
        
        setImage(response)  // Set the generated image in the state
      } catch (err) {
        console.error("Error generating image:", err);  // Log error
         // Set error state if something goes wrong
      } finally {
        setIsLoading(false);  // Set loading state to false after operation
      }
    }
    if(prompt.length>0){
      generateImage()
    } else{
        setGenerations([])
        setActiveIndex(undefined);
    }
   
  }, [debouncedPrompt,iterativeMode]);

  useEffect(() => {
    
    if (image && !generations.map((g) => g.image).includes(image)) {
      setGenerations((images) => [...images, { prompt, image }]);
      setActiveIndex(generations.length);
    }
   
  }, [image]);

  let activeImage =
    activeIndex !== undefined ? generations[activeIndex].image : undefined;

  return (
    <div className="flex h-full flex-col px-5" style={{height:"100vh"}}>
      <header className="flex justify-center pt-20 md:justify-end md:pt-14">
        <div className="absolute left-1/2 top-6 -translate-x-1/2">
          <a href="https://www.dub.sh/together-ai" target="_blank">
            <img src={bhlogo} alt="Example" width={150} height={150}/>
          </a>
        </div>
        <div>
           <label className="text-xs text-gray-200">
            {/* [Optional] Add your{" "} */}
            {/* <a
              href="https://api.together.xyz/settings/api-keys"
              target="_blank"
              className="underline underline-offset-4 transition hover:text-blue-500"
            >
              Together API Key
            </a>{" "} */}
          </label> 
          {/* <Input
            placeholder="API Key"
            type="password"
            value={userAPIKey}
            className="mt-1 bg-gray-400 text-gray-200 placeholder:text-gray-300"
            onChange={(e) => setUserAPIKey(e.target.value)}
          */}
        </div>
      </header>

      <div className="flex justify-center">
        <form className="mt-10 w-full max-w-lg">
          <fieldset>
            <div className="relative">
              <Textarea
                rows={4}
                spellCheck={false}
                placeholder="Describe your image..."
                required
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full resize-none border-gray-300 border-opacity-50 bg-gray-400 px-4 text-base placeholder-gray-300"
              />
              <div
                className={`${isLoading || isDebouncing ? "flex" : "hidden"} absolute bottom-3 right-3 items-center justify-center`}
              >
                <Spinner className="size-4" />
              </div>
            </div>

            <div className="mt-3 text-sm md:text-right">
              <label
                title="Use earlier images as references"
                className="inline-flex items-center gap-2"
              >
                Consistency mode
                <Switch
                  checked={iterativeMode}
                  onCheckedChange={setIterativeMode}
                />
              </label>
            </div>
          </fieldset>
        </form>
      </div>

      <div className="flex w-full grow flex-col items-center justify-center pb-8 pt-4 text-center">
        {!activeImage || !prompt ? (
          <div className="max-w-xl md:max-w-4xl lg:max-w-3xl">
            <p className="text-xl font-semibold text-gray-200 md:text-3xl lg:text-4xl">
              Generate images in real-time
            </p>
            <p className="mt-4 text-balance text-sm text-gray-300 md:text-base lg:text-lg">
              Enter a prompt and generate images in milliseconds as you type.
              Powered by Flux.
            </p>
          </div>
        ) : (
          <div className="mt-4 flex w-full max-w-4xl flex-col justify-center">
            <div>
              <img
                placeholder="blur"
                blurDataURL={imagePlaceholder.blurDataURL}
                width={1024}
                height={768}
                src={`data:image/png;base64,${activeImage.b64_json}`}
                alt=""
                className={`${isLoading ? "animate-pulse" : ""} max-w-full rounded-lg object-cover shadow-sm shadow-black`}
              />
            </div>

            <div className="mt-4 flex gap-4 overflow-x-scroll pb-4">
              {generations.map((generatedImage, i) => (
                <button
                  key={i}
                  className="w-32 shrink-0 opacity-50 hover:opacity-100"
                  onClick={() => setActiveIndex(i)}
                >
                  <img
                    placeholder="blur"
                    blurDataURL={imagePlaceholder.blurDataURL}
                    width={1024}
                    height={768}
                    src={`data:image/png;base64,${generatedImage.image.b64_json}`}
                    alt=""
                    className="max-w-full rounded-lg object-cover shadow-sm shadow-black"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <footer className="mt-16 w-full items-center pb-10 text-center text-gray-300 md:mt-4 md:flex md:justify-between md:pb-5 md:text-xs lg:text-sm">
        <p>
          Powered by{" "}
         
          &{" "}
          <a
          
            target="_blank"
            className="underline underline-offset-4 transition hover:text-blue-500"
          >
            Flux
          </a>
        </p>

        <div className="mt-8 flex items-center justify-center md:mt-0 md:justify-between md:gap-6">
          <p className="hidden whitespace-nowrap md:block">
            100% free 
            {/* <a
             
              target="_blank"
              className="underline underline-offset-4 transition hover:text-blue-500"
            >
              open source
            </a> */}
          </p>

          <div className="flex gap-6 md:gap-2">
            <a href="https://www.linkedin.com/in/mridul-shukla-899123174/" target="_blank">
              <Button
                variant="outline"
                size="sm"
                className="inline-flex items-center gap-2"
              >
                <LinkedinIcon className="size-2" />
                Linkedin
              </Button>
            </a>
            <a href="https://x.com/Mridul74983490" target="_blank">
              <Button
                size="sm"
                variant="outline"
                className="inline-flex items-center gap-2"
              >
                <XIcon className="size-3" />
                Twitter
              </Button>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
