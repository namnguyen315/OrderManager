import Orderform from "@/components/OrderForm";

export default function Page() {
  const companies = [
    { id: "cty01", name: "Công ty A" },
    { id: "cty02", name: "Công ty B" },
  ];

  return (
    <div>
      <Orderform companies={companies} />
    </div>
  );
}
