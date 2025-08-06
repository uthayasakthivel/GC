const ArticleSelect = ({ articles, value, onChange }) => (
  <select name="articleId" value={value} onChange={onChange} required>
    <option value="">Select Article</option>
    {articles.map((article) => (
      <option key={article._id} value={article._id}>
        {article.jewelleryName}
      </option>
    ))}
  </select>
);

export default ArticleSelect;
