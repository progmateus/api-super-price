interface IUserResponseDTO {
    id?: string;
    name: string;
    lastname: string;
    email: string;
    avatar?: string;
    avatar_url(): string
}
export { IUserResponseDTO };