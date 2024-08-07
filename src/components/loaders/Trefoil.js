import { trefoil } from 'ldrs';

const Trefoill = () => {
  trefoil.register();

  return (
    <l-trefoil
      size="40"
      stroke="4"
      stroke-length="0.15"
      bg-opacity="0.1"
      speed="1.4"
      color="black"
    />
  );
};

export default Trefoill;