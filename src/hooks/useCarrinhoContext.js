import { CarrinhoContext } from "../context/CarrinhoContext";
import { useContext, useEffect, useMemo } from "react";

export const useCarrinhoContext = () => {
  const {
    carrinho,
    setCarrinho,
    quantidade,
    setQuantidade,
    valorTotal,
    setValorTotal,
  } = useContext(CarrinhoContext);

  function mudarQuantidade(id, quantidade) {
    return carrinho.map((itemDoCarrinho) => {
      if (itemDoCarrinho.id === id) {
        return {
          ...itemDoCarrinho,
          quantidade: (itemDoCarrinho.quantidade += quantidade),
        };
      }
      return itemDoCarrinho;
    });
  }

  function adicionarProduto(novoProduto) {
    const produtoExiste = carrinho.some(
      (itemDoCarrinho) => itemDoCarrinho.id === novoProduto.id
    );

    if (!produtoExiste) {
      novoProduto.quantidade = 1;
      return setCarrinho([...carrinho, novoProduto]);
    }

    const carrinhoAtualizado = mudarQuantidade(novoProduto.id, 1);
    setCarrinho(carrinhoAtualizado);
  }

  function removerProduto(id) {
    const produto = carrinho.find((itemDoCarrinho) => itemDoCarrinho.id === id);
    const lastUnit = produto.quantidade === 1;
    if (lastUnit) {
      return setCarrinho(
        carrinho.filter((itemDoCarrinho) => itemDoCarrinho.id !== id)
      );
    }

    const carrinhoAtualizado = mudarQuantidade(id, -1);
    setCarrinho(carrinhoAtualizado);
  }

  function removerProdutoCarrinho(id) {
    const produto = carrinho.filter(
      (itemDoCarrinho) => itemDoCarrinho.id !== id
    );
    setCarrinho(produto);
  }

  const { totalTemp, quantidadeTemp } = useMemo(() => {
    return carrinho.reduce(
        (acumulador, produto) => ({
          quantidadeTemp: acumulador.quantidadeTemp + produto.quantidade,
          totalTemp: acumulador.totalTemp + produto.preco * produto.quantidade,
        }),
        {
          quantidadeTemp: 0,
          totalTemp: 0,
        }
      );
  }, [carrinho]);

  useEffect(() => {
    setQuantidade(quantidadeTemp);
    setValorTotal(totalTemp);
  });

  return {
    carrinho,
    setCarrinho,
    adicionarProduto,
    removerProduto,
    removerProdutoCarrinho,
    valorTotal,
    quantidade,
  };
};
