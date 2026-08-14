const HeadingBlock = ({ block }) => {
  return (
    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
      {block.text}
    </h2>
  );
};

export default HeadingBlock;
