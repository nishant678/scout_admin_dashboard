import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import { cn } from '../../utils';
import { getSections, getCounties } from '../../services/sectionService';

const registrationSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone must be at least 10 digits'),
    age: z.coerce.number().min(5, 'Age must be at least 5').max(120, 'Invalid age'),
    section: z.string().min(1, 'Please select a section'),
    unit: z.string().min(1, 'Unit is required'),
    county: z.string().min(1, 'County is required'),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

interface RegistrationFormProps {
    onSubmit: (data: RegistrationFormData) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
    onSubmit,
    onCancel,
    isLoading = false,
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<RegistrationFormData>({
        resolver: zodResolver(registrationSchema),
    });

    const [sections, setSections] = useState<string[]>([]);
    const [counties, setCounties] = useState<string[]>([]);

    useEffect(() => {
        getSections().then((list) => setSections(list.map((s) => s.name))).catch(() => {});
        getCounties().then((list) => setCounties(list.map((c) => c.name))).catch(() => {});
    }, []);

    const handleFormSubmit = (data: RegistrationFormData) => {
        onSubmit(data);
        reset();
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                    </label>
                    <Input
                        {...register('name')}
                        placeholder="Enter full name"
                        className={cn(
                            errors.name && 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                        )}
                    />
                    {errors.name && (
                        <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                    )}
                </div>

                {/* Age */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Age *
                    </label>
                    <Input
                        {...register('age')}
                        type="number"
                        placeholder="Enter age"
                        className={cn(
                            errors.age && 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                        )}
                    />
                    {errors.age && (
                        <p className="text-red-500 text-xs mt-1">{errors.age.message}</p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                    </label>
                    <Input
                        {...register('email')}
                        type="email"
                        placeholder="Enter email address"
                        className={cn(
                            errors.email && 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                        )}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                    )}
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                    </label>
                    <Input
                        {...register('phone')}
                        type="tel"
                        placeholder="Enter phone number"
                        className={cn(
                            errors.phone && 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                        )}
                    />
                    {errors.phone && (
                        <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                    )}
                </div>

                {/* Section */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Section *
                    </label>
                    <select
                        {...register('section')}
                        className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                    >
                        <option value="">Select a section</option>
                        {sections.map((section) => (
                            <option key={section} value={section}>
                                {section}
                            </option>
                        ))}
                    </select>
                    {errors.section && (
                        <p className="text-red-500 text-xs mt-1">{errors.section.message}</p>
                    )}
                </div>

                {/* Unit */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Unit *
                    </label>
                    <Input
                        {...register('unit')}
                        placeholder="Enter unit name"
                        className={cn(
                            errors.unit && 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                        )}
                    />
                    {errors.unit && (
                        <p className="text-red-500 text-xs mt-1">{errors.unit.message}</p>
                    )}
                </div>

                {/* County */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        County *
                    </label>
                    <select
                        {...register('county')}
                        className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                    >
                        <option value="">Select a county</option>
                        {counties.map((county) => (
                            <option key={county} value={county}>
                                {county}
                            </option>
                        ))}
                    </select>
                    {errors.county && (
                        <p className="text-red-500 text-xs mt-1">{errors.county.message}</p>
                    )}
                </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                    disabled={isLoading}
                >
                    Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={isLoading}>
                    {isLoading ? 'Submitting...' : 'Submit Registration'}
                </Button>
            </div>
        </form>
    );
};

export default RegistrationForm;
