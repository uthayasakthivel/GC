import { ChevronDownIcon } from "@heroicons/react/24/outline";

const ArticleSelect = ({ articles, value, onChange }) => (
  <div className="relative w-full">
    <select
      name="articleId"
      value={value}
      onChange={onChange}
      required
      className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-700 focus:ring-2 focus:ring-[#00b8db] outline-none appearance-none"
    >
      <option value="" disabled>
        Select Article
      </option>
      {articles.map((article) => (
        <option key={article._id} value={article._id}>
          {article.jewelleryName}
        </option>
      ))}
    </select>
    <ChevronDownIcon className="w-5 h-5 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
  </div>
);

export default ArticleSelect;
