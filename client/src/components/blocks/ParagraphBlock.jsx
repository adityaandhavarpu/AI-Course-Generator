const ParagraphBlock = ({ block }) => {
  return (
    <p className="text-[#c4c7c5] leading-relaxed text-sm sm:text-base my-3">
      {block.text || block}
    </p>
  );
};

export default ParagraphBlock;
