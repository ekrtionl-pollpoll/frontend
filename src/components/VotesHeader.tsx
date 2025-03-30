import { Button } from "./ui/button";

const VotesHeader = () => {
  return (
    // <div className='bg-gray-100 p-4 flex justify-between items-center'>
    <div className='card-cta'>
      <div className='flex gap-2'>
        <h3 className='text-lg font-bold'>Votes</h3>
        <h3 className='text-lg font-bold'>Trending</h3>
      </div>
      <div className='flex gap-2'>
        <Button className='bg-blue-500 text-white px-4 py-2 rounded'>
          Category
        </Button>
        <Button className='bg-blue-500 text-white px-4 py-2 rounded'>
          Sort
        </Button>
      </div>
    </div>
  );
};

export default VotesHeader;
