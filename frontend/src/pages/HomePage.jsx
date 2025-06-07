import CategoryItem from "../components/CategoryItem";
import { useProductStore } from "../stores/useProductStore";

const categories = [
	{ href: "/legumes", name: "Legumes", imageUrl: "/vegetais.jpg" },
	{ href: "/compotas", name: "Compotas", imageUrl: "/compotas.jpg" },
	{ href: "/frutas", name: "Frutas", imageUrl: "/frutas.jpg" },
	{ href: "/pães", name: "Pães", imageUrl: "/paes.jpg" },
	{ href: "/grãos", name: "Grãos", imageUrl: "/cereais.jpg" },
	{ href: "/temperos", name: "Temperos", imageUrl: "/temperos.jpg" },
];

const HomePage = () => {
	const { products, isLoading } = useProductStore();

	return (
		<div className='relative min-h-screen text-white overflow-hidden'>
			<div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				<h1 className='text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4'>
					Do campo para sua casa!
				</h1>
				<p className='text-center text-xl text-gray-300 mb-12'>
					Produtos frescos e saudáveis direto de pequenos produtores locais.
				</p>

				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
					{categories.map((category) => (
						<CategoryItem category={category} key={category.name} />
					))}
				</div>

				{!isLoading && products.length > 0}
			</div>
		</div>
	);
};
export default HomePage;
