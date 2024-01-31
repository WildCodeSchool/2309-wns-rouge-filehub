import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { Tag, TagCreateInput, TagUpdateInput } from "../entities/Tag";
import { validate } from "class-validator";

@Resolver(Tag)
export class TagsResolver {
    @Query(()=>[Tag])
    async allTags(): Promise<Tag[]> {
        return await Tag.find({relations: {
          ads: true
        }});
    }

    @Query(()=> Tag, {nullable: true})
    async getOneTag(@Arg("id", () => ID) id: number): Promise<Tag | null> {
      return await Tag.findOne({where:{
        id: id
      },
      relations : {
        ads: true
    }});
    }

    @Mutation(() => Tag)
    async createTag(@Arg("data", () => TagCreateInput) data: TagCreateInput): Promise<Tag> {
      const newTag = new Tag();
      Object.assign(newTag, data);

      const errors = await validate(newTag);
          if (errors.length === 0) {
            await newTag.save();
            return (newTag);
          } else {
            throw new Error(`Error occured : ${JSON.stringify(errors)}`)
          }
    }

    @Mutation(() => Tag, { nullable: true })
    async updateTag( @Arg("id", () => ID) id: number, @Arg("data") data: TagUpdateInput): Promise<Tag | null>{
      const targetTag = await Tag.findOne({where:{id: id},
        relations : {ads: true}});

        if (targetTag){
          Object.assign(targetTag, data);
          const errors = await validate(targetTag);
            if (errors.length === 0) {
              await targetTag.save();

              return (await Tag.findOne({where:{id: id},
                relations : {ads: true}}));
            } else {
              throw new Error(`Error occured : ${JSON.stringify(errors)}`)
            }
        }
        return targetTag;
    }

    @Mutation(() => Tag, {nullable: true})
    async deleteTag(@Arg("id", () => ID) id: number): Promise<Tag | null> {
      const targetTag = await Tag.findOneBy({id: id});

      if (targetTag){
        await targetTag.remove();
        targetTag.id = id;
      }
      return targetTag;
    }
}