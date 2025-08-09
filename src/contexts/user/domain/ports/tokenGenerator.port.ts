export interface TokenGenerator {
    generateToken(payload: object): string;
}