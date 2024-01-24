import { FC, PropsWithChildren, memo } from "react";
import BottomEffect from "@/assets/images/footer.svg";
import Image from "next/image";

interface Props {
  className?: string;
}

const Background: FC<PropsWithChildren<Props>> = ({ children, className }) => {
  return (
    <main className={`min-h-screen bg-background ${className || ""}`}>
      {children}
      <Image
        src={BottomEffect}
        alt="bottom"
        className="fixed bottom-0 left-0 right-0 w-full"
        priority={true}
      />
    </main>
  );
};

export default memo(Background);
