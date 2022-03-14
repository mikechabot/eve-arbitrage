import { EntityRepository, Repository } from 'typeorm';

import { InvType } from 'src/entities/InvType';

@EntityRepository(InvType)
export class ItemTypeRepository extends Repository<InvType> {
  async getItemTypeByTypeIdMap(): Promise<Record<number, InvType>> {
    const items = await this.find({});

    const itemByItemType = {} as Record<number, InvType>;
    items!.forEach((item) => {
      itemByItemType[item.typeId] = item;
    });

    return itemByItemType;
  }
}
