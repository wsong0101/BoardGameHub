export interface IUser {
	ID: number
	Nickname: string
	Email: string
	Authority: number
}

export interface IItem {
	ID: number
	PrimaryName: string
	KoreanName: string
	Thumbnail: string
	MinPlayers: number
	MaxPlayers: number
	MinPlayingTime: number
	MaxPlayingTime: number
	MinAge: number
	BestNumPlayers: number
	RecommendNumPlayers: number
	NotRecommendedNumPlayers: number
	Tags: ITag[]
}

export interface ITag {
	ID: number
	TagType: number
	PrimaryName: string
	KoreanName: string
}

export interface ICollection {
	ID:          number
	ItemID?: number
	PrimaryName: string
	KoreanName:  string
	Thumbnail:   string
	Own:         number
	PrevOwned:   number
	ForTrade:    number
	Want:        number
	WantToBuy:   number
	Wishlist:    number
	Preordered:  number
	Score:       number
	Memo:        string
	IsExistInDB: boolean
	Status: 	 string[]
}

export interface ICollectionUpdate {
	ID: number
	Type: string
	Score?: number
	Status?: string[]
	Memo?: string
	IsExistInDB?: boolean
}

export interface IPropose {
	Type: string
	Value: string
	ID: number
	ReturnPath: string
}