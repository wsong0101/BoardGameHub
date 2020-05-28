export class Util {
  static getName(elem) {
    if (!elem) {
      return ""
    }
    if (elem.KoreanName != undefined) {
      if (elem.KoreanName == "") {
        return elem.PrimaryName
      }
      return elem.KoreanName
    }

    if (elem.KoreanValue == "") {
      return elem.PrimaryValue
    }
    return elem.KoreanName
  }

  static assignCollectionStatus(collection, status) {
    let cpy = collection.set("Own", 0)
    .set("PrevOwned", 0)
    .set("ForTrade", 0)
    .set("Want", 0)
    .set("WantToBuy", 0)
    .set("Wishlist", 0)
    .set("Preordered", 0)

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

  static updateCollection(collection, type, value) {
    switch (type) {
      case "score":
        return collection.Score = value
      case "status":
        return collection.Status = value
      case "memo":
        return collection.Memo = value
      case "exist":
        return collection.IsExistInDB = value
    }
  }

  static getStatusListFromCollection(e) {
    let status = []    
    if (!e) {
      return status
    }

    if (e.Own == 1) {
      status.push("own")
    }
    if (e.PrevOwned == 1) {
      status.push("prev_owned")
    }
    if (e.ForTrade == 1) {
      status.push("for_trade")
    }
    if (e.Want == 1) {
      status.push("want")
    }
    if (e.WantToBuy == 1) {
      status.push("want_to_buy")
    }
    if (e.Wishlist == 1) {
      status.push("wishlist")
    }
    if (e.Preordered == 1) {
      status.push("preordered")
    }

    return status
  }
}