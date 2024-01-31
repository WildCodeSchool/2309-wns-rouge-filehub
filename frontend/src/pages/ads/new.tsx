import AdForm from "@/components/AdForm";

const NewAd = (): React.ReactNode => {
    return (
        <main className="main-content">
            <h2>Création d'une Annonce</h2>
            <AdForm 
                action="Post"
            />
        </main>
    )
}
export default NewAd;