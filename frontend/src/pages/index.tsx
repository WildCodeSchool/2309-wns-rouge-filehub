
import {useRouter} from "next/router";
import Header from "@/layout/header";
import {TestStyled} from '@/components/TestStyled';


export default function Home(): React.ReactNode {
    const router = useRouter();


    return (
        <div>
            <Header/>
            <TestStyled/>
        </div>
    )
}


