import { EntityRepository, Repository } from 'typeorm';

import { InvType } from 'src/entities/InvType';

@EntityRepository(InvType)
export class ItemTypeRepository extends Repository<InvType> {
  private cacheMap: Record<number, InvType>;
  constructor() {
    super();
  }

  async getItemTypeByTypeIdMap(): Promise<Record<number, InvType>> {
    if (this.cacheMap) {
      return this.cacheMap;
    }

    const items = await this.find({ relations: ['group', 'group.category'] });

    const itemByItemType = {} as Record<number, InvType>;
    items!.forEach((item) => {
      itemByItemType[item.typeId] = item;
    });

    this.cacheMap = itemByItemType;

    return itemByItemType;
  }
}
