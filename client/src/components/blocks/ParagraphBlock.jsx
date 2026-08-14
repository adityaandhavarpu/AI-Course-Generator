const ParagraphBlock = ({ block }) => {
  return (
    <p className="text-gray-700 leading-relaxed mb-4">
      {block.text}
    </p>
  );
};

export default ParagraphBlock;
