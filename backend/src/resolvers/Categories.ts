import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { Category, CategoryCreateInput, CategoryUpdateInput } from "../entities/Category";
import { validate } from "class-validator";

@Resolver(Category)
export class CategoriesResolver {
    @Query(()=>[Category])
    async allCategories(): Promise<Category[]> {
        return await Category.find({relations : {
            ads: true
        }});
    }

    @Query(()=> Category, {nullable: true})
    async getOneCategory(@Arg("id", () => ID) id: number): Promise<Category | null> {
      return await Category.findOne({where:{
        id: id
      },
      relations : {
        ads: true
    }});
    }

    @Mutation(() => Category)
    async createCategory(@Arg("data", () => CategoryCreateInput) data: CategoryCreateInput): Promise<Category> {
        const newCategory = new Category();
        Object.assign(newCategory, data);

        const errors = await validate(newCategory);
            if (errors.length === 0) {
              await newCategory.save();
              return (newCategory);
            } else {
              throw new Error(`Error occured : ${JSON.stringify(errors)}`)
            }
    }

    @Mutation(() => Category, { nullable: true })
    async updateCategory( @Arg("id", () => ID) id: number,
      @Arg("data") data: CategoryUpdateInput): Promise<Category | null>{
      const targetCategory = await Category.findOne({where:{id: id},
        relations : {ads: true}});

        if (targetCategory){
          Object.assign(targetCategory, data);
          const errors = await validate(targetCategory);
            if (errors.length === 0) {
              await targetCategory.save();

              return (await Category.findOne({where:{id: id},
                relations : {ads: true}}));
            } else {
              throw new Error(`Error occured : ${JSON.stringify(errors)}`)
            }
        }
        return targetCategory;
    }

    @Mutation(() => Category, {nullable: true})
    async deleteCategory(@Arg("id", () => ID) id: number): Promise<Category | null> {
      const targetCategory = await Category.findOneBy({id: id});

      if (targetCategory){
        await targetCategory.remove();
        targetCategory.id = id;
      }
      return targetCategory;
    }
}