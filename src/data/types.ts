export type Difficulty = "Easy" | "Medium" | "Hard";

export interface User {
  id: string;
  name: string;
  username: string;
  bio: string;
  avatarColor: string;
  cover: string;
  recipeCount: number;
  followers: number;
  following: number;
}

export interface IngredientGroup {
  group: string;
  items: string[];
}

export interface Step {
  title: string;
  description: string;
}

export interface Comment {
  id: string;
  recipeId: string;
  authorId: string;
  authorName: string;
  body: string;
  rating?: number;
  createdAt: string;
  likes: number;
  parentId?: string;
}

export interface Recipe {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  cuisine: string;
  mealType: string;
  category: string;
  difficulty: Difficulty;
  prepMinutes: number;
  cookMinutes: number;
  totalMinutes: number;
  servings: number;
  rating: number;
  likes: number;
  commentCount: number;
  authorId: string;
  tags: string[];
  dietary: string[];
  ingredients: IngredientGroup[];
  steps: Step[];
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  time: string;
  image: string;
  caption: string;
  recipeId?: string;
  likes: number;
  comments: number;
}

export interface Collection {
  id: string;
  name: string;
  recipeIds: string[];
}

export interface AppNotification {
  id: string;
  type: "like" | "comment" | "follow" | "rating";
  text: string;
  time: string;
  read: boolean;
}
