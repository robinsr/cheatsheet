import short from 'short-uuid';

const uuid = short();

export const newUuid = () => {
    return uuid.new();
}