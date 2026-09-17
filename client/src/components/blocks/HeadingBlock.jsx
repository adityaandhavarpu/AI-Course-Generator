const HeadingBlock = ({ block }) => {
  return (
    <h3 className="text-xl font-bold text-[#e3e3e3] mt-8 mb-3 tracking-tight border-b border-[#2d2f31] pb-2">
      {block.text}
    </h3>
  );
};

export default HeadingBlock;

