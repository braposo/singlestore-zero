const endpoint = process.env.ENDPOINT;

export default (url: string) => fetch(`${endpoint}${url}`);
