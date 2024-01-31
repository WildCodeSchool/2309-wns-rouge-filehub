import { CategoryProps } from "@/types";

const Category = (props: CategoryProps): React.ReactNode => {
    return (
        <a href={props.link} className="category-navigation-link">{props.name}</a>
    )
}
export default Category;