import TagForm from "@/components/TagForm";

const NewTag = (): React.ReactNode => {
    return (
        <main className="main-content">
            <h2>Création d'un tag</h2>
            <TagForm 
                action="Post"
            />
        </main>
    )
}
export default NewTag;