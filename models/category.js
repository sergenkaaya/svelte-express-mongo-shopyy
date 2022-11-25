import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import slug from 'mongoose-slug-updater';

mongoose.plugin(slug);

const categorySchema = Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
    slug: "title",
  },
});

export default mongoose.model("Category", categorySchema);