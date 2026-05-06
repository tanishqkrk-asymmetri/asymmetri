import { Button } from "../ui/button";

export function Footer() {
  return (
    <section className="flex flex-col gap-6 xl:gap-8 items-center justify-center text-center bg-asymmetri-red min-h-screen w-full z-99 fixed bottom-0 ">
      <h2 className="font-chakra-petch font-medium text-2xl lg:text-4xl xl:text-5xl">
        Let’s turn your ideas into <br /> beautiful asymmetry.
      </h2>

      <div className="flex flex-row gap-2 xl:gap-4">
        <Button
          size="lg"
          className="font-chakra-petch text-asymmetri-red py-4 font-semibold"
        >
          Get in touch
        </Button>
        <Button
          size="lg"
          className="font-chakra-petch bg-transparent font-semibold"
          variant={"outline"}
        >
          Join our team
        </Button>
      </div>
    </section>
  );
}
