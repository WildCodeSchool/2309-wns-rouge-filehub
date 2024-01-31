import { Arg, Authorized, Ctx, ID, Int, Mutation, Query, Resolver } from "type-graphql";
import { Ad, AdCreateInput, AdUpdateInput, AdsWhere } from "../entities/Ad";
import { validate } from "class-validator";
import { In, LessThanOrEqual, Like, MoreThanOrEqual } from "typeorm";
import { ContextType } from "../auth";


@Resolver(Ad)
export class AdsResolver {
  @Query(()=>[Ad])
  async allAds(@Arg("where", { nullable: true }) where?: AdsWhere, 
  @Arg("take", { nullable: true }) take?: number,
  @Arg("skip", { nullable: true }) skip?: number): Promise<Ad[]> {

    const queryWhere: any = {};

    if (where?.categoryIn) {
      queryWhere.category = { id: In(where.categoryIn) };
    }

    if (where?.searchTitle) {
      queryWhere.title = Like(`%${where.searchTitle}%`);
    }

    if (where?.priceGte) {
      queryWhere.price = MoreThanOrEqual(Number(where.priceGte));
    }

    if (where?.priceLte) {
      queryWhere.price = LessThanOrEqual(Number(where.priceLte));
    }

    return await Ad.find({
      take: take ?? 5,
      skip: skip ?? 0,
      where: queryWhere,
      relations : {
        tags: true,
        category: true,
        createdBy: true
      },
      order: {
        id: "ASC"
    }
      });
  }

  @Query(()=>Int)
  async allAdsCount(@Arg("where", { nullable: true }) where?: AdsWhere): Promise<number> {
    const queryWhere: any = {};

    if (where?.categoryIn) {
      queryWhere.category = { id: In(where.categoryIn) };
    }

    if (where?.searchTitle) {
      queryWhere.title = Like(`%${where.searchTitle}%`);
    }

    if (where?.priceGte) {
      queryWhere.price = MoreThanOrEqual(Number(where.priceGte));
    }

    if (where?.priceLte) {
      queryWhere.price = LessThanOrEqual(Number(where.priceLte));
    }

    const count = await Ad.count({
      where: queryWhere});
    
    return count;
  }

  @Query(()=> Ad, {nullable: true})
  async getOneAd(@Arg("id", () => ID) id: number): Promise<Ad | null> {
    return await Ad.findOne({where:{
      id: id
    },
    relations : {
      tags: true,
      category: true,
      createdBy: true
  }});
  }

  @Authorized()
  @Mutation(() => Ad)
  async createAd(@Ctx() context: ContextType,
    @Arg("data", () => AdCreateInput) data: AdCreateInput): Promise<Ad> {
      const newAd = new Ad();
      Object.assign(newAd, data, {
        createdBy: context.user
      });
      newAd.createdAt = new Date();
      console.log(newAd);

      const errors = await validate(newAd);
          if (errors.length === 0) {
            await newAd.save();
            return (newAd);
          } else {
            throw new Error(`Error occured : ${JSON.stringify(errors)}`)
          }
  }

  @Authorized()
  @Mutation(() => Ad, { nullable: true })
  async updateAd(@Ctx() context: ContextType,
    @Arg("id", () => ID) id: number, @Arg("data") data: AdUpdateInput): Promise<Ad | null>{
    const targetAd = await Ad.findOne({where:{id: id},
      relations : {tags: true, category: true, createdBy: true}});

      if (targetAd && targetAd.createdBy.id === context.user?.id){
        Object.assign(targetAd, data);
        const errors = await validate(targetAd);
          if (errors.length === 0) {
            await targetAd.save();

            return (await Ad.findOne({where:{id: id},
              relations : {tags: true, category: true, createdBy: true}}));
          } else {
            throw new Error(`Error occured : ${JSON.stringify(errors)}`)
          }
      }
      return targetAd;
  }

  @Authorized()
  @Mutation(() => Ad, {nullable: true})
  async deleteAd(@Ctx() context: ContextType, @Arg("id", () => ID) id: number): Promise<Ad | null> {
    const targetAd = await Ad.findOne({where:{id: id},
      relations : {tags: true, category: true, createdBy: true}});
    if (targetAd && targetAd.createdBy.id === context.user?.id){
      await targetAd.remove();
      targetAd.id = id;
    }
    return targetAd;
  }
}