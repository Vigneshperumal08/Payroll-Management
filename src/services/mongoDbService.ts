
// MongoDB service for handling connections
import { toast } from "sonner";

export interface MongoDbConfig {
  uri: string;
  dbName: string;
  userRole: string;
}

export class MongoDbService {
  private static instance: MongoDbService;
  private isConnected: boolean = false;
  private connectionString: string = '';
  
  private constructor() {}
  
  public static getInstance(): MongoDbService {
    if (!MongoDbService.instance) {
      MongoDbService.instance = new MongoDbService();
    }
    return MongoDbService.instance;
  }
  
  /**
   * Initialize connection to MongoDB
   * @param config MongoDB connection configuration
   */
  public async connect(config: MongoDbConfig): Promise<boolean> {
    if (this.isConnected) {
      console.log('MongoDB is already connected');
      return true;
    }
    
    try {
      // In a real app, this would be:
      // const client = new MongoClient(config.uri);
      // await client.connect();
      // this.db = client.db(config.dbName);
      
      // For demo, simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Validate connection string (using the one from .env)
      if (!config.uri || config.uri === 'your_mongodb_atlas_connection_string') {
        throw new Error('Invalid MongoDB URI');
      }
      
      // Add more detailed logging for demo purposes
      console.log(`MongoDB connected with URI: ${config.uri.substring(0, 20)}...`);
      console.log(`MongoDB connected with role: ${config.userRole}`);
      console.log(`MongoDB database name: ${config.dbName}`);
      
      this.isConnected = true;
      this.connectionString = config.uri;
      
      return true;
    } catch (error) {
      console.error('MongoDB connection error:', error);
      this.isConnected = false;
      throw error;
    }
  }
  
  /**
   * Disconnect from MongoDB
   */
  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }
    
    try {
      // In a real app, this would be:
      // await this.client.close();
      
      console.log('MongoDB disconnected');
      this.isConnected = false;
    } catch (error) {
      console.error('MongoDB disconnect error:', error);
      throw error;
    }
  }
  
  /**
   * Check if connected to MongoDB
   */
  public getConnectionStatus(): boolean {
    return this.isConnected;
  }
  
  /**
   * Get connection string (first few characters)
   */
  public getConnectionStringPreview(): string {
    if (this.connectionString) {
      return `${this.connectionString.substring(0, 20)}...`;
    }
    return '';
  }
}

export default MongoDbService.getInstance();
