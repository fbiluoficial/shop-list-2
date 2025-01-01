import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaSearch, FaEdit, FaTrash, FaCheck } from 'react-icons/fa';

const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: linear-gradient(145deg, #1e1e2f, #2a2a40);
  border-radius: 15px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  color: #fff;

  @media (max-width: 850px) {
    margin: 1rem;
    padding: 1rem;
  }
`;

const Title = styled.h1`
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #00c9ff;
  text-shadow: 0 0 10px rgba(0, 201, 255, 0.3);
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;

  .name-field {
    grid-column: span 2;
  }

  .button-field {
    grid-column: span 1;
    display: flex;
    align-items: flex-start;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
    
    .name-field {
      grid-column: 1 / -1;
    }

    .button-field {
      grid-column: 1 / -1;
    }
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    
    > * {
      grid-column: 1 / -1;
    }
  }

  .error {
    grid-column: 1 / -1;
    color: #ff4444;
  }
`;

const Input = styled.input`
  padding: 0.8rem;
  border-radius: 5px;
  border: 1px solid #444;
  background-color: #333;
  color: #fff;
  
  &:focus {
    outline: none;
    border-color: #00c9ff;
    box-shadow: 0 0 10px rgba(0, 201, 255, 0.3);
  }
`;

const Select = styled.select`
  padding: 0.8rem;
  border-radius: 5px;
  border: 1px solid #444;
  background-color: #333;
  color: #fff;
  
  &:focus {
    outline: none;
    border-color: #00c9ff;
    box-shadow: 0 0 10px rgba(0, 201, 255, 0.3);
  }
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  border-radius: 5px;
  border: none;
  background: ${props => props.danger ? 
    'linear-gradient(90deg, #ff4444, #ff6b6b)' : 
    'linear-gradient(90deg, #00c9ff, #92fe9d)'
  };
  color: #1a1a2e;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:active {
    transform: translateY(1px);
  }
`;

const IconButton = styled(Button)`
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => 
    props.danger ? '#ff4444' : 
    props.success ? '#00ff95' : 
    '#00c9ff'
  };

  &:hover {
    transform: translateY(-2px);
    filter: brightness(1.1);
  }
`;

const List = styled.ul`
  list-style: none;
  margin-top: 2rem;
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 2rem;

  .search-icon {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #888;
    cursor: pointer;
    transition: color 0.2s;

    &:hover {
      color: #00c9ff;
    }
  }
`;

const SearchInput = styled(Input)`
  width: 100%;
  padding-right: 3rem;
`;

const ListItem = styled.li`
  display: grid;
  grid-template-columns: auto minmax(150px, 2fr) minmax(100px, 1fr) auto auto auto auto;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 5px;
  margin-bottom: 0.5rem;
  transition: transform 0.2s;
  text-decoration: ${props => props.checked ? 'line-through' : 'none'};
  opacity: ${props => props.checked ? 0.7 : 1};

  &:hover {
    transform: translateX(5px);
  }

  .date-info {
    font-size: 0.8rem;
    color: ${props => {
      if (!props.expirationDate) return '#888';
      const days = Math.ceil((new Date(props.expirationDate) - new Date()) / (1000 * 60 * 60 * 24));
      if (days < 0) return '#ff4444';
      if (days < 7) return '#ffaa00';
      return '#00ff95';
    }};
  }

  @media (max-width: 768px) {
    grid-template-columns: auto 1fr;
    grid-template-rows: auto auto;
    gap: 0.5rem;
    padding: 0.8rem;

    > *:not(:first-child):not(:last-child) {
      grid-column: 2;
    }

    .actions {
      grid-column: 1 / -1;
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }

    .date-info {
      font-size: 0.7rem;
    }
  }
`;

const NoItems = styled.p`
  text-align: center;
  margin-top: 2rem;
  color: #888;
`;

const ActionsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-bottom: 1rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
    
    button {
      width: 100%;
    }
  }
`;

function App() {
  const [items, setItems] = useState(() => {
    const savedItems = localStorage.getItem('shoppingList');
    if (savedItems) {
      try {
        const parsedItems = JSON.parse(savedItems);
        // Converter strings de data de volta para o formato correto
        return parsedItems.map(item => ({
          ...item,
          expirationDate: item.expirationDate || null
        }));
      } catch (error) {
        console.error('Erro ao carregar itens salvos:', error);
        return [];
      }
    }
    return [];
  });
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [expirationDate, setExpirationDate] = useState('');

  // Salvar no localStorage sempre que items mudar
  useEffect(() => {
    try {
      localStorage.setItem('shoppingList', JSON.stringify(items));
    } catch (error) {
      console.error('Erro ao salvar itens:', error);
    }
  }, [items]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor, insira o nome do item');
      return;
    }

    if (editingId) {
      setItems(items.map(item => 
        item.id === editingId 
          ? { 
              ...item, 
              name: name.trim(), 
              category, 
              expirationDate: expirationDate || null
            } 
          : item
      ));
      setEditingId(null);
    } else {
      setItems([...items, { 
        id: Date.now(), 
        name: name.trim(), 
        category: category || 'Sem categoria',
        checked: false,
        expirationDate: expirationDate || null
      }]);
    }

    setName('');
    setCategory('');
    setExpirationDate('');
    setError('');
  };

  const clearAllItems = () => {
    if (window.confirm('Tem certeza que deseja limpar toda a lista?')) {
      setItems([]);
      localStorage.removeItem('shoppingList');
    }
  };

  const handleClearCheckedItems = () => {
    if (window.confirm('Remover todos os itens marcados?')) {
      setItems(items.filter(item => !item.checked));
    }
  };

  const handleEdit = (item) => {
    setName(item.name);
    setCategory(item.category === 'Sem categoria' ? '' : item.category);
    setExpirationDate(item.expirationDate || '');
    setEditingId(item.id);
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR');
  };

  const getDaysUntilExpiration = (date) => {
    if (!date) return null;
    const days = Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));
    if (days < 0) return 'Vencido';
    if (days === 0) return 'Vence hoje';
    if (days === 1) return 'Vence amanhã';
    return `Vence em ${days} dias`;
  };

  const handleDelete = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleToggleCheck = (id) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // A pesquisa já acontece automaticamente através do filteredItems
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container>
      <Title>Lista de Compras Futurista</Title>
      
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Pesquisar itens..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <FaSearch className="search-icon" onClick={handleSearch} />
      </SearchContainer>

      <Form onSubmit={handleSubmit}>
        {error && <div className="error">{error}</div>}
        <Input
          className="name-field"
          type="text"
          placeholder="Nome do item"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Categoria (opcional)</option>
          <option value="Mercado">Mercado</option>
          <option value="Eletrônicos">Eletrônicos</option>
          <option value="Roupas">Roupas</option>
          <option value="Livros">Livros</option>
          <option value="Outros">Outros</option>
        </Select>
        <Input
          type="date"
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
          title="Data de validade (opcional)"
        />
        <div className="button-field">
          <Button type="submit">
            {editingId ? 'Atualizar' : 'Adicionar'}
          </Button>
        </div>
      </Form>

      {items.length > 0 && (
        <ActionsContainer>
          <Button onClick={handleClearCheckedItems}>
            Limpar Marcados
          </Button>
          <Button danger onClick={clearAllItems}>
            Limpar Tudo
          </Button>
        </ActionsContainer>
      )}

      {filteredItems.length === 0 ? (
        <NoItems>Nenhum item na lista. Adicione alguns itens acima!</NoItems>
      ) : (
        <List>
          {filteredItems.map(item => (
            <ListItem 
              key={item.id} 
              checked={item.checked}
              expirationDate={item.expirationDate}
            >
              <IconButton 
                success 
                onClick={() => handleToggleCheck(item.id)}
              >
                <FaCheck />
              </IconButton>
              <span>{item.name}</span>
              <span>{item.category}</span>
              <span className="date-info" title="Data de validade">
                {item.expirationDate && (
                  <>
                    {formatDate(item.expirationDate)}
                    <br />
                    {getDaysUntilExpiration(item.expirationDate)}
                  </>
                )}
              </span>
              <div className="actions">
                <IconButton onClick={() => handleEdit(item)}>
                  <FaEdit />
                </IconButton>
                <IconButton danger onClick={() => handleDelete(item.id)}>
                  <FaTrash />
                </IconButton>
              </div>
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
}

export default App;
