import { ICollection, IItem, ITag, ICollectionUpdate } from '../common'

export class Util {
  static getName(elem: any) {
    if (elem.KoreanName == "") {
      return elem.PrimaryName
    }
    return elem.KoreanName
  }

  static assignCollectionStatus(collection: ICollection, status: string[]) {
    collection.Own = 0
    collection.PrevOwned = 0
    collection.ForTrade = 0
    collection.Want = 0
    collection.WantToBuy = 0
    collection.Wishlist = 0
    collection.Preordered = 0

    for (const s of status) {
      switch(s) {
        case "own":
          collection.Own = 1
          break
        case "prev_owned":
          collection.PrevOwned = 1
          break
        case "for_trade":
          collection.ForTrade = 1
          break
        case "want":
          collection.Want = 1
          break
        case "want_to_buy":
          collection.WantToBuy = 1
          break
        case "wishlist":
          collection.Wishlist = 1
          break
        case "preordered":
          collection.Preordered = 1
          break
      }
    }
  }

  static updateCollection(collection: ICollection, update:ICollectionUpdate) {
    if (!collection) {
      return
    }
    if (update.Score) {
      collection.Score = update.Score
    }
    if (update.Status) {
      collection.Status = update.Status
    }
    if (update.Memo) {
      collection.Memo = update.Memo
    }
    if (update.IsExistInDB) {
      collection.IsExistInDB = update.IsExistInDB
    }
  }


  static getStatusListFromCollection(collection: ICollection): string[] {
    let status = []

    if (collection.Own == 1) {
      status.push("own")
    }
    if (collection.PrevOwned == 1) {
      status.push("prev_owned")
    }
    if (collection.ForTrade == 1) {
      status.push("for_trade")
    }
    if (collection.Want == 1) {
      status.push("want")
    }
    if (collection.WantToBuy == 1) {
      status.push("want_to_buy")
    }
    if (collection.Wishlist == 1) {
      status.push("wishlist")
    }
    if (collection.Preordered == 1) {
      status.push("preordered")
    }

    return status
  }
}