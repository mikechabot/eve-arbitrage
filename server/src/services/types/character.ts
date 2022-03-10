export interface Character {
  CharacterID: number;
  CharacterName: string;
  ExpiresOn: string;
  Scopes: string; // Space delimited scopes
  TokenType: string;
  CharacterOwnerHash: string;
  IntellectualProperty: string;
}
