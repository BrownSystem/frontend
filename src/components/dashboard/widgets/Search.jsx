import { SearchIcon } from "../../../assets/icons";

const Search = ({ placeholder }) => {
  return (
    <div className="relative">
      <form className="relative w-[350px]">
        <input
          type="text"
          placeholder={placeholder}
          className="w-full bg-[var(--brown-ligth-50)] border-white border-2 p-[10px] rounded-md text-gray-950 text-1xl font-medium"
        />
        <div className="py-1 px-1 absolute top-1 right-1 rounded-md bg-gradient-to-b from-[var(--brown-ligth-400)] to-[var(--brown-dark-800)] cursor-pointer">
          <SearchIcon color={"white"} />
        </div>
      </form>
    </div>
  );
};

export default Search;
