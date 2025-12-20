import { defineQuery } from "next-sanity";

export const GROOMING_IMAGES_QUERY = defineQuery(`
  *[_type == "heroImage" && section == "grooming"] | order(order asc) {
    _id,
    title,
    "url": image.asset->url
  }
`);
