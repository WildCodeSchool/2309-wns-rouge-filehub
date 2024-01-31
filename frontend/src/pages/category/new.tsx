import CategoryForm from "@/components/CategoryForm";

const NewCategory = (): React.ReactNode => {
    return (
        <main className="main-content">
            <h2>Création d'une Catergorie</h2>
            <CategoryForm 
                action="Post"
            />
        </main>
    )
}
export default NewCategory;