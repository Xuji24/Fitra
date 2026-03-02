import Link from "next/link";
import Image from "next/image"; 

export default function Logo() {
    return(
        <Link href="/">
            <Image
              src="/dark-logo-bfe.png"
              alt="Be Fit ERA Logo"
              width={150}
              height={50}
              className="w-36 sm:w-44 h-auto object-contain dark:brightness-0 dark:invert"
            />
          </Link>
    );
}

export function FooterLogo() {
    return(
        <Link href="/">
            <Image
              src="/be-fit-era-logo.png"
              alt="Be Fit ERA Logo"
              width={200}
              height={200}
              className="w-40 h-auto object-contain"
            />
          </Link>
    );
}