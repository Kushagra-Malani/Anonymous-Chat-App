import { Client, Account, Databases} from 'appwrite';
import conf from './conf/conf.js';

export const client = new Client();

client
    .setEndpoint(conf.appwriteUrl)
    .setProject(conf.appwriteProjectId); // project ID

export const databases = new Databases(client);
export const account = new Account(client);
export { ID } from 'appwrite';