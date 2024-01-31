import { queryMe } from "@/query&mutations";
import { useQuery } from "@apollo/client";
import { UserType } from "@/types";

const Me = (): React.ReactNode => {
    const {data} = useQuery<{me: UserType}>(queryMe);
    const me = data?.me;

    return (
        <main className="main-content">
            <h2>Mon Profil</h2>
            <p>id : {me?.id}</p>
            <p>mail : {me?.email}</p>
        </main>
    )
}
export default Me;