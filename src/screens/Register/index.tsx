import React, { useState } from 'react';
import { Alert, Keyboard, Modal, TouchableWithoutFeedback } from 'react-native';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';

import { Button } from '../../components/Form/Button';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';
import { InputForm } from '../../components/Form/InputForm';
import { CategorySelect } from '../CategorySelect';

import {
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionTypes,
} from './styles';
import { useAuth } from '../../hooks/auth';

type FormData = {
    name: string;
    amount: string;
}

type NavigationProps = {
    navigate: (screen: string) => void;
}

const schema = Yup.object().shape({
    name: Yup
        .string()
        .required('Nome é obrigatório.'),
    amount: Yup
        .number()
        .typeError('Informe um valor numérico')
        .positive('O valor não pode ser negativo.')
        .required('O valor é obrigatório.')
});

export function Register() {
    const [transactionType, setTransactionType] = useState('');
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);

    const { user } = useAuth();

    const [category, setCategory] = useState({
        key: 'category',
        name: 'Catgoria',
    });

    // const navigation = useNavigation<NavigationProps>();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema)
    });

    function handleTransactionTypeSelect(type: 'positive' | 'negative') {
        setTransactionType(type);
    }

    function handleOpenSelectCategoryModal() {
        setTimeout(() => {
            setCategoryModalOpen(true)
        }, 1000)
    }

    function handleCloseSelectCategoryModal() {
        setCategoryModalOpen(false)
    }

    async function hangleRegister(form: FormData) {
        if (!transactionType)
            return Alert.alert('Selecione o tipo da transação.');

        if (category.key === 'category')
            return Alert.alert('Selecione a categoria.')

        const newTransaction = {
            id: uuidv4(),
            name: form.name,
            amount: form.amount,
            type: transactionType,
            category: category.key,
            date: new Date()
        }

        try {
            const dataKey = `@gofinances:transactions_user:${user.id}`;
            const data = await AsyncStorage.getItem(dataKey);
            const currentDate = data ? JSON.parse(data) : [];
            const dataFormatted = [
                ...currentDate,
                newTransaction
            ];

            await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));
            reset();
            setTransactionType('');
            setCategory({
                key: 'category',
                name: 'Catgoria',
            });

            Alert.alert('Dados salvos com sucesso.');

            // navigation.navigate('Listagem');

        } catch (error) {
            console.log(error);
            Alert.alert('Não foi possível salvar.');
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Container>
                <Header>
                    <Title>Cadastro</Title>
                </Header>

                <Form>
                    <Fields>
                        <InputForm
                            name="name"
                            control={control}
                            placeholder="Nome"
                            autoCapitalize="sentences"
                            autoCorrect={false}
                            error={errors.name && errors.name.message}
                        />
                        <InputForm
                            name="amount"
                            control={control}
                            placeholder="Preço"
                            keyboardType="numeric"
                            error={errors.amount && errors.amount.message}
                        />
                        <TransactionTypes>
                            <TransactionTypeButton
                                type="up"
                                title="Entrada"
                                onPress={() => handleTransactionTypeSelect('positive')}
                                isActive={transactionType === 'positive'}
                            />
                            <TransactionTypeButton
                                type="down"
                                title="Saída"
                                onPress={() => handleTransactionTypeSelect('negative')}
                                isActive={transactionType === 'negative'}
                            />
                        </TransactionTypes>
                        <CategorySelectButton
                            testID="button-category"
                            title={category.name}
                            isActive={category.key !== 'category'}
                            onPress={handleOpenSelectCategoryModal}
                        />
                    </Fields>
                    <Button
                        title="Enviar"
                        onPress={handleSubmit(hangleRegister)}
                    />
                </Form>

                <Modal testID="modal-category" visible={categoryModalOpen}>
                    <CategorySelect
                        category={category}
                        setCategory={setCategory}
                        closeSelectCategory={handleCloseSelectCategoryModal}
                    />
                </Modal>
            </Container>
        </TouchableWithoutFeedback>
    )
}