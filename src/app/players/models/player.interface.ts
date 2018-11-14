export class Player {
    timestamp: number;
    name: string;
    score: number
}

export class defaultPlayers {
    fromLocalStorage: boolean;
    storedDate: Player[];
}

export class PlayerHistory {
    timestamp: Date;
    name: Player;
    score: number
}