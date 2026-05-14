import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { createPollThunk } from '../pollSlice';
import { validateCreatePoll } from '../pollValidation';
import { toCreatePollDTO } from '../pollDTOs';

import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import QRCodeCard from '../../../components/ui/QRCodeCard';

export default function CreatePollPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error: apiError } = useSelector((state) => state.poll);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    options: ['', ''],
    isAnonymousAllowed: true,
    isMultipleChoice: false,
    showLeaderboard: true,
    showAnalytics: false,
    collectParticipantInfo: false,
    timerDuration: 30,
  });

  const [errors, setErrors] = useState({});
  const [successData, setSuccessData] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData((prev) => ({ ...prev, options: newOptions }));
    
    setErrors((prev) => {
      const newErrors = { ...prev };
      if (newErrors.optionsList) {
        newErrors.optionsList[index] = '';
      }
      return newErrors;
    });
  };

  const addOption = () => {
    if (formData.options.length < 8) {
      setFormData((prev) => ({ ...prev, options: [...prev.options, ''] }));
    }
  };

  const removeOption = (index) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, options: newOptions }));
      
      setErrors((prev) => {
        const newErrors = { ...prev };
        if (newErrors.optionsList) {
          newErrors.optionsList.splice(index, 1);
        }
        return newErrors;
      });
    }
  };

  const handleToggle = (name) => {
    setFormData((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleKeyDown = (e, nextId) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (nextId) {
        const nextEl = document.getElementById(nextId);
        if (nextEl) nextEl.focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const dataToValidate = {
      ...formData,
      timerDuration: Number(formData.timerDuration),
    };

    const { valid, errors: validationErrors } = validateCreatePoll(dataToValidate);
    
    if (!valid) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    
    const dto = toCreatePollDTO(dataToValidate);
    
    const resultAction = await dispatch(createPollThunk(dto));
    if (createPollThunk.fulfilled.match(resultAction)) {
      setSuccessData(resultAction.payload.data);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-5 md:px-10 py-8 relative z-10">
      <Link to="/dashboard" className="inline-flex items-center text-primary hover:text-primary-fixed mb-6 font-hanken-grotesk font-medium transition-colors">
        <span className="material-symbols-outlined mr-2">arrow_back</span>
        Dashboard
      </Link>
      
      <div className="mb-8">
        <h1 className="font-sora text-[32px] md:text-[48px] font-extrabold text-on-surface leading-[1.1] tracking-[-0.02em]">
          Create New Poll
        </h1>
        <p className="font-hanken-grotesk text-on-surface-variant text-lg mt-2">
          Configure your poll settings and add up to 8 options.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        <Card>
          <label className="block font-jetbrains-mono text-[12px] uppercase tracking-[0.1em] text-on-surface-variant mb-4">
            POLL TITLE
          </label>
          <div className="relative">
            <textarea
              id="poll-title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              onKeyDown={(e) => handleKeyDown(e, 'poll-description')}
              placeholder="What is your poll about?"
              className={`w-full bg-surface-container-highest border ${errors.title ? 'border-error/50' : 'border-outline-variant/50'} rounded-lg py-4 px-4 text-on-surface font-hanken-grotesk text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-on-surface-variant/50 resize-none`}
              rows={3}
            />
            <div className="absolute bottom-3 right-4 font-jetbrains-mono text-[12px] text-on-surface-variant">
              {formData.title.length}/300
            </div>
          </div>
          {errors.title && <p className="text-error text-sm mt-2 font-hanken-grotesk">{errors.title}</p>}
        </Card>

        <Card>
          <label className="block font-jetbrains-mono text-[12px] uppercase tracking-[0.1em] text-on-surface-variant mb-4">
            DESCRIPTION (OPTIONAL)
          </label>
          <div className="relative">
            <textarea
              id="poll-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              onKeyDown={(e) => handleKeyDown(e, 'poll-option-0')}
              placeholder="Provide more context for your poll..."
              className={`w-full bg-surface-container-highest border ${errors.description ? 'border-error/50' : 'border-outline-variant/50'} rounded-lg py-4 px-4 text-on-surface font-hanken-grotesk text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-on-surface-variant/50 resize-none`}
              rows={2}
            />
            <div className="absolute bottom-3 right-4 font-jetbrains-mono text-[12px] text-on-surface-variant">
              {formData.description.length}/500
            </div>
          </div>
          {errors.description && <p className="text-error text-sm mt-2 font-hanken-grotesk">{errors.description}</p>}
        </Card>

        <Card>
          <label className="block font-jetbrains-mono text-[12px] uppercase tracking-[0.1em] text-on-surface-variant mb-4">
            ANSWER OPTIONS
          </label>
          <div className="space-y-4">
            {formData.options.map((opt, index) => (
              <div key={index}>
                <div className="flex items-center gap-3">
                  <span className="font-jetbrains-mono text-on-surface-variant w-4 text-right">
                    {index + 1}
                  </span>
                  <span className="material-symbols-outlined text-outline-variant cursor-grab">
                    drag_indicator
                  </span>
                  <div className="flex-1 relative">
                    <input
                      id={`poll-option-${index}`}
                      type="text"
                      value={opt}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          if (index < formData.options.length - 1) {
                            const nextEl = document.getElementById(`poll-option-${index + 1}`);
                            if (nextEl) nextEl.focus();
                          } else {
                            const nextEl = document.getElementById('poll-timer');
                            if (nextEl) nextEl.focus();
                          }
                        }
                      }}
                      placeholder={`Option ${index + 1}`}
                      className={`w-full bg-surface-container-highest border ${errors.optionsList && errors.optionsList[index] ? 'border-error/50' : 'border-outline-variant/50'} rounded-lg py-3 px-4 text-on-surface font-hanken-grotesk focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-on-surface-variant/50`}
                    />
                  </div>
                  {formData.options.length > 2 ? (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="text-on-surface-variant hover:text-error transition-colors p-2"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  ) : (
                    <div className="w-10"></div>
                  )}
                </div>
                {errors.optionsList && errors.optionsList[index] && (
                  <p className="text-error text-sm mt-1 ml-16 font-hanken-grotesk">{errors.optionsList[index]}</p>
                )}
              </div>
            ))}
            
            {errors.options && <p className="text-error text-sm mt-2 font-hanken-grotesk">{errors.options}</p>}

            {formData.options.length < 8 && (
              <div className="pt-2 pl-14">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={addOption}
                  icon="add_circle"
                >
                  Add Option
                </Button>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <label className="block font-jetbrains-mono text-[12px] uppercase tracking-[0.1em] text-on-surface-variant mb-4">
            POLL SETTINGS
          </label>
          <div className="space-y-6">
            <ToggleSwitch
              label="Anonymous Voting Allowed"
              description="Anyone with the link can vote without signing in."
              checked={formData.isAnonymousAllowed}
              onChange={() => handleToggle('isAnonymousAllowed')}
            />
            <ToggleSwitch
              label="Show Leaderboard"
              description="Display a ranked list of voters (if not completely anonymous)."
              checked={formData.showLeaderboard}
              onChange={() => handleToggle('showLeaderboard')}
            />
            <ToggleSwitch
              label="Show Analytics to Participants"
              description="Allow everyone to see detailed charts and engagement stats."
              checked={formData.showAnalytics}
              onChange={() => handleToggle('showAnalytics')}
            />
          </div>
        </Card>

        <Card>
          <label className="block font-jetbrains-mono text-[12px] uppercase tracking-[0.1em] text-on-surface-variant mb-4">
            POLL DURATION
          </label>
          <div className="flex flex-col">
            <span className="font-hanken-grotesk text-on-surface-variant text-sm mb-3">
              Select how long the poll will remain active before automatically closing.
            </span>
            <div className="relative">
              <select
                id="poll-timer"
                name="timerDuration"
                value={formData.timerDuration}
                onChange={handleChange}
                className={`w-full bg-surface-container-highest border ${errors.timerDuration ? 'border-error/50' : 'border-outline-variant/50'} rounded-lg py-4 px-4 text-on-surface font-hanken-grotesk text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none cursor-pointer`}
              >
                <option value={30}>30 seconds</option>
                <option value={60}>1 minute</option>
                <option value={600}>10 minutes</option>
                <option value={1200}>20 minutes</option>
                <option value={1800}>30 minutes</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <span className="material-symbols-outlined text-on-surface-variant">expand_more</span>
              </div>
            </div>
            {errors.timerDuration && <p className="text-error text-sm mt-2 font-hanken-grotesk">{errors.timerDuration}</p>}
          </div>
        </Card>

        {apiError && (
          <div className="bg-error-container text-on-error-container p-4 rounded-lg font-hanken-grotesk">
            {typeof apiError === 'string' ? apiError : 'Failed to create poll. Please try again.'}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#e85d8a] text-white font-hanken-grotesk text-lg py-4 px-6 rounded-lg shadow-[0_0_20px_rgba(232,93,138,0.3)] hover:shadow-[0_0_30px_rgba(232,93,138,0.45)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center font-bold"
        >
          {isLoading ? (
            <span className="material-symbols-outlined animate-spin mr-2">refresh</span>
          ) : null}
          Create Poll
        </button>
      </form>

      <Modal isOpen={!!successData} onClose={() => navigate('/dashboard')}>
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-tertiary/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-tertiary/30">
            <span className="material-symbols-outlined text-tertiary text-3xl">check_circle</span>
          </div>
          <h2 className="font-sora text-2xl font-bold text-on-surface mb-2">Poll Created!</h2>
          <p className="font-hanken-grotesk text-on-surface-variant">
            Your poll is now live and ready to be shared.
          </p>
        </div>
        
        {successData && (
          <div className="mb-6 flex justify-center">
            <QRCodeCard
              url={`${window.location.origin}/share/${successData.shareCode}`}
              title="Share Code"
              shareCode={successData.shareCode}
            />
          </div>
        )}
        
        <div className="flex flex-col gap-3">
          <Button variant="primary" onClick={() => navigate(`/poll/${successData?.id || successData?._id}/live`)} className="w-full">
            Open Live Dashboard
          </Button>
          <Button variant="ghost" onClick={() => navigate(`/poll/${successData?.id || successData?._id}`)} className="w-full">
            Go to Poll Booth
          </Button>
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="w-full">
            Back to Dashboard
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function ToggleSwitch({ label, description, checked, onChange }) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex flex-col mr-4">
        <span className="font-hanken-grotesk text-on-surface font-medium mb-1">
          {label}
        </span>
        <span className="font-hanken-grotesk text-on-surface-variant text-sm">
          {description}
        </span>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background ${
          checked ? 'bg-tertiary' : 'bg-surface-container-high'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}
